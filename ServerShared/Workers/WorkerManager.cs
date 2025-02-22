﻿namespace FileFlows.Server.Workers;

using FileFlows.ServerShared.Workers;

public class WorkerManager
{
    static readonly List<Worker> Workers = new List<Worker>();

    public static void StartWorkers(params Worker[] workers)
    {
        if (workers?.Any() != true)
            return; // workers already running
        foreach (var worker in workers)
        {
            Workers.Add(worker);
            worker.Start();
        }
    }
    public static void StopWorkers()
    {
        foreach (var worker in Workers)
            worker.Stop();
        Workers.Clear();
    }
}
