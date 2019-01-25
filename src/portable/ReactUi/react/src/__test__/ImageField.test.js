/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {ImageField} from '../components/ui-controls/ImageField';

configure({ adapter: new Adapter() });

// Snapshot for ImageField
describe('>>>Control: ImageField --- Snapshot',()=>{
    const minProps = {
        caption: "Caption",
        extensions: "my extensions",
        fromPath: "/main",
        id: "myId",
        inputValue: "Any Value",
        isReadOnly: true,
        message: "error message",
    };

    it('+++capturing Snapshot of ImageField', () => {
        const renderedValue =  renderer.create(<Router><ImageField {...minProps}/></Router>).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: ImageField', () => {
    let wrapper;
    const minProps = {
        caption: "Caption",
        fromPath: "/main",
    };

    beforeEach(() => {
        wrapper = shallow(<ImageField {...minProps} />);
    });

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
