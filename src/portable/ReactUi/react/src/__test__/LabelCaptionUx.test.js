import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {LabelCaptionUx} from '../components/ui-controls/LabelCaptionUx';

configure({ adapter: new Adapter() })

// Snapshot for LabelCaptionUx
describe('>>>Control: LabelCaptionUx --- Snapshot',()=>{
    const minProps = {
        name: "Caption",
        type: "safe",
    };

    it('+++capturing Snapshot of LabelCaptionUx', () => {
        const renderedValue =  renderer.create(<LabelCaptionUx {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: LabelCaptionUx', () => {
    let wrapper;
    const minProps = {
        name: "Caption",
        type: "safe",
    };

    beforeEach(() => {
        wrapper = shallow(<LabelCaptionUx {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
