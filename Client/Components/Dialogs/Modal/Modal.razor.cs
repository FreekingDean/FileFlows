using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using FileFlows.Shared;

namespace FileFlows.Client.Components.Dialogs
{
    public partial class Modal : ComponentBase
    {
        [Parameter] public RenderFragment Footer { get; set; }

        [Parameter] public RenderFragment Body { get; set; }
        [Parameter] public string Title { get; set; }

        [Parameter] public bool Visible { get; set; }

    }
}