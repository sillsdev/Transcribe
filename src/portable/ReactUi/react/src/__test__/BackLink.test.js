/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import BackLink from '../components/controls/BackLink';

configure({ adapter: new Adapter() });

// Snapshot for BackLink
describe('>>>Control: Backlink --- Snapshot',()=>{
    it('+++capturing Snapshot of BackLink', () => {
        const renderedValue =  renderer.create(<Router><BackLink target={"/root"}/></Router>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: BackLink', () => {
    let wrapper;
    const minProps = {
        target: "/root",
    };

    beforeEach(()=>{
        wrapper = shallow(<BackLink {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('+++ activates back link action', () => {
        const onButtonClick = sinon.spy();
        const linkWrapper = shallow(<BackLink {...minProps} action={onButtonClick}/>)
        linkWrapper.find('Link').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });

    it('+++ has link when enabled', () => {
        const linkWrapper = shallow(<BackLink {...minProps} disable={false}/>)
        expect(linkWrapper.find('Link').length).toEqual(1)
    });

    it('+++ has no link when disabled', () => {
        const linkWrapper = shallow(<BackLink {...minProps} disable={true}/>)
        expect(linkWrapper.find('Link').length).toEqual(0)
    });

});
