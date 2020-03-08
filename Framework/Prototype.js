const Utility = require("./Utility");

class ProtoType {
    static Initialize() {

        String.prototype.toDate = () => {
            let value = this.length !== 0 && new Date(this.concat()) || '';
            return value;
        }

        String.prototype.renderDate = () => {
            let value = '';
            if (this.length !== 0) {
                value = new Date(this.concat());
                let month = value.getMonth() + 1,
                    day = value.getDate(),
                    year = value.getFullYear();
                month = `${month.toString().length === 1 ? '0' : ''}${month}`;
                day = `${day.toString().length === 1 ? '0' : ''}${day}`;
                value = `${year}-${month}-${day}`;
            }
            return value;
        }

        Array.prototype.contains = (val) => {
            return !Utility.isNullOrEmpty(this.find(e => e === val));
        }
    }
}
module.exports = ProtoType;