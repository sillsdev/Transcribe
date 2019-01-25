/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import TaskItem from '../components/controls/TaskItem';
import AnchorHelp from '../components/ui-controls/AnchorHelp';

configure({ adapter: new Adapter() })

// Snapshot for TaskItem
describe('>>>Control: TaskItem --- Snapshot',()=>{
    const minProps = {
        id: 'AnchorHelp',
        onClick: jest.fn()
    };

    it('+++capturing Snapshot of TaskItem', () => {
        const renderedValue =  renderer.create(<AnchorHelp {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: TaskItem', () => {
    let wrapper;
    const minProps = {
        id: 'AnchorHelp',
        onClick: jest.fn()
    };

    beforeEach(()=>{
        wrapper = shallow(<AnchorHelp {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
