import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {IconButtonField} from '../components/ui-controls/IconButtonField';

configure({ adapter: new Adapter() })

// Snapshot for IconButtonField
describe('>>>Control: IconButtonField --- Snapshot',()=>{
    const minProps = {
        caption: "Caption",
        imageUrl: "cancel.svg",
    };

    it('+++capturing Snapshot of IconButtonField', () => {
        const renderedValue =  renderer.create(<IconButtonField {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: IconButtonField', () => {
    let wrapper;
    const minProps = {
        caption: "Caption",
        imageUrl: "cancel.svg"
    };

    beforeEach(() => {
        wrapper = shallow(<IconButtonField {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('+++ sets link action', () => {
        const onButtonClick = sinon.spy();
        const linkWrapper = shallow(<IconButtonField {...minProps} id="myButton" onClick={onButtonClick}/>)
        linkWrapper.find('#myButton').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });
});
