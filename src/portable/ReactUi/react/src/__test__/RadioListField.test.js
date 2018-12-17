/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import { RadioListField } from '../components/ui-controls/RadioListField';

configure({ adapter: new Adapter() })

// Snapshot for RadioListField
describe('>>>Control: RadioListField --- Snapshot',()=>{
    const minProps = {
        options: [ "admin", "reviewer", "transcriber"],
        strings: {
            passphrase: "Enter Password"
        }
    };

    it('+++capturing Snapshot of RadioListField', () => {
        const renderedValue =  renderer.create(<RadioListField {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: RadioListField', () => {
    let wrapper;
    const minProps = {
        options: [ "admin", "reviewer", "transcriber"],
        strings: {
            passphrase: "Enter Password"
        }
    };

    beforeEach(()=>{
        wrapper = shallow(<RadioListField {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
