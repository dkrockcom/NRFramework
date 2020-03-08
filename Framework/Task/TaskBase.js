class TaskBase {
    constructor(props) {
        this.Id = 0;
        this.Nmae = '';
        Object.assign(this, props);
    }

    execute() { }
}
module.exports = TaskBase;