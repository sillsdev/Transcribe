/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import TimeMarker from '../components/controls/TimeMarker';

configure({ adapter: new Adapter() })

// Snapshot for TimeMarker
describe('>>>Control: TimeMarker --- Snapshot',()=>{
    const minProps = {
        playedSeconds: 10,
        totalSeconds: 30,
        timer: "countdown",
    };

    it('+++capturing Snapshot of TimeMarker', () => {
        const renderedValue =  renderer.create(<TimeMarker {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: TimeMarker', () => {
    let wrapper;
    const minProps = {
        target: (context) => {return false;},
        text: "My Filter",
        type: "safe",
    };

    beforeEach(()=>{
        wrapper = shallow(<TimeMarker {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
