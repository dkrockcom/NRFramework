const NodeCronJob = require('cron');

let Tasks = [];
let ActiveTask = [];

class TaskManager {
    static get Tasks() { return Tasks };
    static get ActiveTask() { return ActiveTask };

    static set Tasks(val) { Tasks = val };
    static set ActiveTask(val) { ActiveTask = val };

    static Initialize() {
        this.Tasks.forEach(activeTask => {
            const job = new NodeCronJob.CronJob(activeTask.Interval, activeTask.Task.execute, null, true);
            this.ActiveTask.push({ name: activeTask.Name, task: job });
            job.start();
        });
    }

    static Add(task, interval, name) {
        this.Tasks.push({ Task: task, Interval: interval, Name: name });
    }

    static Start(name) {
        let index = this.ActiveTask.findIndex(e => e.name === "DeleteUser");
        if (index > -1) {
            let activeTask = this.ActiveTask[index];
            !activeTask.task.running && activeTask.task.start();
        }
    }

    static Stop(name) {
        let index = this.ActiveTask.findIndex(e => e.name === "DeleteUser");
        if (index > -1) {
            let activeTask = this.ActiveTask[index];
            activeTask.task.running && activeTask.task.stop();
        }
    }
}
module.exports = TaskManager;