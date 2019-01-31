/* jshint esversion: 6 */
import React from 'react';
import Slider from 'rc-slider'
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import RangeSliderField from '../components/ui-controls/RangeSliderField';

configure({ adapter: new Adapter() })

// Snapshot for RangeSliderField
describe('>>>Control: RangeSliderField --- Snapshot',()=>{
    const direction = "ltr";
    const yellowColor = "#F5CC4C";
    const greenColor = "#C7DE31";
    const firstIndex = direction && direction === "rtl"? {label:"synced",style:{color:greenColor},text:"Complete"}: {label:"start",style:{color:greenColor},text:"Transcribe"};
    const secondIndex = direction && direction === "rtl"? {label:"reviewed",style:{color:greenColor},text:"Upload"}: {label:"transcribed",style:{color:greenColor},text:"Review"};
    const thirdIndex = direction && direction === "rtl"? {label:"transcribed",style:{color:greenColor},text:"Review"}: {label:"reviewed",style:{color:greenColor},text:"Upload"};
    const fourthIndex = direction && direction === "rtl"? {label:"start",style:{color:greenColor},text:"Transcribe"}: {label:"synced",style:{color:greenColor},text:"Complete"};
    const minProps = {
        caption: "My Range Slider",
        marks: {0: firstIndex,1: secondIndex,2: thirdIndex,3: fourthIndex},
        selected: 1,
    };

    it('+++capturing Snapshot of RangeSliderField', () => {
        const renderedValue =  renderer.create(<RangeSliderField {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: RangeSliderField', () => {
    let wrapper;
    const direction = "ltr";
    const yellowColor = "#F5CC4C";
    const greenColor = "#C7DE31";
    const firstIndex = direction && direction === "rtl"? {label:"synced",style:{color:greenColor},text:"Complete"}: {label:"start",style:{color:greenColor},text:"Transcribe"};
    const secondIndex = direction && direction === "rtl"? {label:"reviewed",style:{color:greenColor},text:"Upload"}: {label:"transcribed",style:{color:greenColor},text:"Review"};
    const thirdIndex = direction && direction === "rtl"? {label:"transcribed",style:{color:greenColor},text:"Review"}: {label:"reviewed",style:{color:greenColor},text:"Upload"};
    const fourthIndex = direction && direction === "rtl"? {label:"start",style:{color:greenColor},text:"Transcribe"}: {label:"synced",style:{color:greenColor},text:"Complete"};
    const minProps = {
        caption: "My Range Slider",
        marks: {0: firstIndex,1: secondIndex,2: thirdIndex,3: fourthIndex},
        selected: 1,
    };

    beforeEach(() => {
        wrapper = shallow(<RangeSliderField {...minProps} />);
    });

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});