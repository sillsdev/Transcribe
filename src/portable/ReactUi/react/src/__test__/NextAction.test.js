import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import NextAction from '../components/controls/NextAction';

configure({ adapter: new Adapter() })

// Snapshot for NextAction
describe('>>>Control: NextAction --- Snapshot',()=>{
    const minProps = {
        target: (context) => {return false;},
        text: "My Filter",
        type: "safe",
    };

    it('+++capturing Snapshot of NextAction', () => {
        const renderedValue =  renderer.create(<NextAction {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: NextAction', () => {
    let wrapper;
    const minProps = {
        target: (context) => {return false;},
        text: "My Filter",
        type: "safe",
    };

    beforeEach(()=>{
        wrapper = shallow(<NextAction {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
