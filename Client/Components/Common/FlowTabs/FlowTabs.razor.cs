﻿namespace FileFlows.Client.Components.Common
{
    using Microsoft.AspNetCore.Components;
    using System.Collections.Generic;

    public partial class FlowTabs : ComponentBase
    {
        [Parameter]
        public RenderFragment ChildContent { get; set; }
        public FlowTab ActiveTab { get; internal set; }

        List<FlowTab> Tabs = new List<FlowTab>();

        internal void AddTab(FlowTab tab)
        {
            if (Tabs.Contains(tab) == false)
            {
                Tabs.Add(tab);
                this.StateHasChanged();
            }

            if (ActiveTab == null)
                ActiveTab = tab;
        }

        private void SelectTab(FlowTab tab)
        {
            this.ActiveTab = tab;
        }
    }
}
