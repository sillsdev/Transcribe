import * as React from 'react';
import './DropdownUx.css';

interface IProps {
    collection: any[],
}
class DropdownUx extends React.Component<IProps, any> {
    public selected: string;
    private selectRef: any;

    constructor(props: IProps) {
        super(props)
        this.selectRef = React.createRef();
    }

    public render() {
        // tslint:disable-next-line:no-console
        console.log(this.props.collection);
        const options = this.props.collection.map((value: any) =>
            <option key={value} style={{backgroundColor: '#002B36', color: 'white'}} value={value}>{value}</option>
        )
        const doselect = () => this.onselect(this)
        this.selected = this.props.collection[0];
        return (
            <div className="DropdownUx">
                <select ref={this.selectRef} className="custom-select" onMouseUp={doselect}>
                   {options}
                </select>
            </div>
        )
    }

    private onselect(ctx: DropdownUx) {
        const r = ctx.selectRef.current
        ctx.selected = r && r.options[r.selectedIndex].text
    }
};

export default DropdownUx;

