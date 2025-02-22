﻿using System.Dynamic;

namespace FileFlows.Server.Models
{
    class FlowTemplate
    {
        public string Name { get; set; }
        public string Group { get; set; }
        public string Description { get; set; }
        public List<FlowTemplatePart> Parts { get; set; }
        public List<Shared.Models.TemplateField> Fields { get; set; }
        public int? Order { get; set; }
        public bool Save { get; set; }
    }

    class FlowTemplatePart
    {
        public string Node { get; set; }
        public Guid Uid { get; set; }
        public ExpandoObject Model { get; set; }
        public string Name { get; set; }

        public int? Outputs { get; set; }
        public int? xPos { get; set; }
        public int? yPos { get; set; }

        public List<FlowTemplateConnection> Connections { get; set; }
    }

    class FlowTemplateConnection
    {
        public int Input { get; set; }
        public int Output { get; set; }
        public Guid Node { get; set; }
    }
}
