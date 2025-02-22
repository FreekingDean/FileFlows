﻿namespace FileFlows.Server.Services
{
    using FileFlows.Plugin;
    using FileFlows.Server.Controllers;
    using FileFlows.Server.Helpers;
    using FileFlows.ServerShared.Helpers;
    using FileFlows.ServerShared.Services;
    using FileFlows.Shared.Models;


    public class PluginService : IPluginService
    {
        public Task<List<PluginInfo>> GetAll() => new PluginController().GetDataList();
        public Task<PluginInfo> Update(PluginInfo pluginInfo) => new PluginController().Update(pluginInfo);

        public Task<Node> LoadNode(FlowPart part)
        {
            using var pluginLoader = new PluginHelper();
            return Task.FromResult(pluginLoader.LoadNode(part));
        }

    }
}
