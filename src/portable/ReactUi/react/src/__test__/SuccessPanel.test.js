/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import SucessPanel from '../components/SucessPanel';

configure({ adapter: new Adapter() })

// Snapshot for SucessPanel
describe('>>>Control: SucessPanel --- Snapshot',()=>{
    const minProps = {
        completeTranscription: jest.fn(),
        projectState: "Transcribe",
        strings: { congratulations: "congratulations" },
    };

    it('+++capturing Snapshot of ProgressPane', () => {
        const renderedValue =  renderer.create(<SucessPanel {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: SucessPanel', () => {
    let wrapper;
    const minProps = {
        completeTranscription: jest.fn(),
        projectState: "Transcribe",
        strings: { congratulations: "congratulations" },
    };

    beforeEach(() => {
        wrapper = shallow(<SucessPanel {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});