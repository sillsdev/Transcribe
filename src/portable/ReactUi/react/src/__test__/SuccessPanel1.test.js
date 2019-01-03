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
describe('>>>Control: SucessPanel1 --- Snapshot',()=>{
    const minProps = {
        completeReview: jest.fn(),
        projectState: "Review",
        strings: { congratulations: "congratulations" },
    };

    it('+++capturing Snapshot of SucessPanel1', () => {
        const renderedValue =  renderer.create(<SucessPanel {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
