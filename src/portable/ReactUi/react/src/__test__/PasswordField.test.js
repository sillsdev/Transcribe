/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import PasswordField from '../components/ui-controls/PasswordField';

configure({ adapter: new Adapter() })

// Snapshot for PasswordField
describe('>>>Control: PasswordField --- Snapshot',()=>{
    const minProps = {
        caption: "Password"
    };

    it('+++capturing Snapshot of PasswordField', () => {
        const renderedValue =  renderer.create(<PasswordField {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: PasswordField', () => {
    let wrapper;
    const minProps = {
        caption: "Password"
    };

    beforeEach(()=>{
        wrapper = shallow(<PasswordField {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
