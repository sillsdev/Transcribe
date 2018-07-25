import * as React from 'react';
import './DropdownUx.css';

interface IProps {
    title: string,
    key: string,
    id: number,
    collection: any
}
class DropdownUx extends React.Component<IProps, any> {
    public render() {
        // tslint:disable-next-line:no-console
        console.log(this.props.collection);
        const options = this.props.collection.map((value: any) =>
            <option key={value} style={{backgroundColor: '#002B36', color: 'white'}} value={value}>{value}</option>
        )
        return (
            <div className="DropdownUx">
                <select className="custom-select">
                   {options}
                </select>
            </div>
        )
    }
};

export default DropdownUx;

