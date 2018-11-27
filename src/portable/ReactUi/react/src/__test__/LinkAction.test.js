import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import LinkAction from '../components/controls/LinkAction';

configure({ adapter: new Adapter() })

// Snapshot for LinkAction
describe('>>>Control: LinkAction --- Snapshot',()=>{
    const minProps = {
        target: (context) => {return false;},
        text: "My Filter",
    };

    it('+++capturing Snapshot of LinkAction', () => {
        const renderedValue =  renderer.create(<LinkAction {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: LinkAction', () => {
    let wrapper;
    const minProps = {
        target: (context) => {return false;},
        text: "My Filter",
    };

    beforeEach(()=>{
        wrapper = shallow(<LinkAction {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
