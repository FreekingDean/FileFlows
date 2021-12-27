# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build-env
WORKDIR /app

  # Install pre-requisite packages.
  # Download the Microsoft repository GPG keys
  # Register the Microsoft repository GPG keys
  # Update the list of packages after we added packages.microsoft.com
RUN apt-get update && \ 
  apt-get install -y wget apt-transport-https software-properties-common && \
  wget -q https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb && \
  dpkg -i packages-microsoft-prod.deb && \
  apt-get update && \
  apt-get install -y powershell

COPY ./ ./

# Copy everything else and build
RUN pwsh ./build/build-plugins.ps1

FROM mcr.microsoft.com/dotnet/sdk:6.0-focal

############################################################ 
### Prepare the docker with ffmpeg and hardware encoders ###
############################################################

ENV LIBVA_DRIVERS_PATH="/usr/lib/x86_64-linux-gnu/dri" \
    LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu" \
    NVIDIA_DRIVER_CAPABILITIES="compute,video,utility" \
    NVIDIA_VISIBLE_DEVICES="all" 

# ffmpeg from jellyfin, a little older but precompiled for us
RUN apt-get update && \
    apt install -y wget gnupg && \
    wget https://repo.jellyfin.org/releases/server/ubuntu/versions/jellyfin-ffmpeg/4.3.2-1/jellyfin-ffmpeg_4.3.2-1-focal_amd64.deb && \
    apt install -y \
    ./jellyfin-ffmpeg_4.3.2-1-focal_amd64.deb && \
    # link to /user/local/bin to make it available globally
    ln -s /usr/lib/jellyfin-ffmpeg/ffmpeg /usr/local/bin/ffmpeg

#  add support for intel hardware enconding
RUN curl -s https://repositories.intel.com/graphics/intel-graphics.key | apt-key add - && \
    # add the intel repo to the sources
    echo 'deb [arch=amd64] https://repositories.intel.com/graphics/ubuntu focal main' > /etc/apt/sources.list.d/intel-graphics.list && \
    # update the apt-get repo
    apt-get update && \
    apt-get install -y --no-install-recommends \
    # do the actual intel install
    intel-media-va-driver-non-free vainfo mesa-va-drivers ffmpeg

# install libssl-dev, needed for the asp.net application to run
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get dist-upgrade -y \
    && apt-get install -fy \
    libssl-dev


##########################################
### actual FileFlows stuff happens now ###
##########################################

# expose the ports we need
EXPOSE 5000

# copy the deploy file into the app directory
COPY --from=build-env /app/out /app

# set the working directory
WORKDIR /app

# run the server
ENTRYPOINT [ "dotnet", "/app/FileFlows.dll", "--urls", "http://*:5000" ]
