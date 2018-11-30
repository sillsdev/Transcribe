/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import ButtonLink from '../components/controls/ButtonLink';

configure({ adapter: new Adapter() });

// Snapshot for ButtonLink
describe('>>>Control: Buttonlink --- Snapshot',()=>{
    const minProps = {
        target: "/root",
        text: "My Button",
        type: "primary",
    };

    it('+++capturing Snapshot of ButtonLink', () => {
        const renderedValue =  renderer.create(<Router><ButtonLink {...minProps}/></Router>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: ButtonLink', () => {
    let wrapper;
    const minProps = {
        target: "/root",
        text: "My Button",
        type: "primary",
    };

    beforeEach(() => {
        wrapper = shallow(<ButtonLink {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('+++ sets link action', () => {
        const onButtonClick = sinon.spy();
        const linkWrapper = shallow(<ButtonLink {...minProps} select={onButtonClick}/>)
        linkWrapper.find('Link').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });
});
