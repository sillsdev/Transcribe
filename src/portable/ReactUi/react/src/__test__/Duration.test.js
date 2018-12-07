/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import Duration from '../components/controls/Duration';

configure({ adapter: new Adapter() })

// Snapshot for Duration
describe('>>>Control: Duration --- Snapshot',()=>{
    it('+++capturing Snapshot of Duration', () => {
        const renderedValue =  renderer.create(<Duration seconds={"100"}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: Duration', () => {
    let wrapper;
    const minProps = {
        seconds: "100",
    };

    beforeEach(()=>{
        wrapper = shallow(<Duration {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
