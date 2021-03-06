/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import ToggleSwitch from '../components/controls/ToggleSwitch';

configure({ adapter: new Adapter() })

// Snapshot for ToggleSwitch
describe('>>>Control: ToggleSwitch --- Snapshot',()=>{
    const minProps = {
        enabled: true,
        switched: false,
        text: "ToggleSwitch1",
    };

    it('+++capturing Snapshot of ToggleSwitch', () => {
        const renderedValue =  renderer.create(<ToggleSwitch {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: ToggleSwitch', () => {
    let wrapper;
    const minProps = {
        enabled: true,
        switched: false,
        text: "ToggleSwitch1",
    };

    beforeEach(()=>{
        wrapper = shallow(<ToggleSwitch {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
