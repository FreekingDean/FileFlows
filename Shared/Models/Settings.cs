﻿namespace FileFlows.Shared.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using FileFlows.Plugin.Attributes;

    public class Settings : FileFlowObject
    {

        [Folder(1)]
        [Required]
        public string LoggingPath { get; set; }

        public bool DisableTelemetry { get; set; }

        public string TimeZone { get; set; }

        public string GetLogFile(System.Guid uid)
        {
            if (string.IsNullOrEmpty(LoggingPath))
                return string.Empty;
            return System.IO.Path.Combine(LoggingPath, uid + ".log");
        }
    }

}