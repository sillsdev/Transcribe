/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {User} from '../components/controls/User';

configure({ adapter: new Adapter() })

// Snapshot for User
describe('>>>Control: User --- Snapshot',()=>{
    const minProps = {
        id: "my id",
        name: "my name",
        role: ["my role1","my role2", "my role3"],
        strings: {
            admin: "Admin",
            reviewer: "Reviewer",
            transcriber: "Transcriber"
        },
        target: "/root",
        uri: "images/myImage.png"
    };

    it('+++capturing Snapshot of User', () => {
        const renderedValue =  renderer.create(<Router><User {...minProps}/></Router>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: User', () => {
    let wrapper;
    const minProps = {
        id: "my id",
        name: "my name",
        role: ["my role1","my role2", "my role3"],
        strings: {
            admin: "Admin",
            reviewer: "Reviewer",
            transcriber: "Transcriber"
        },
        target: "/root",
        uri: "images/myImage.png",
    };

    beforeEach(() => {
        wrapper = shallow(<User {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('+++ activates select link action', () => {
        const onButtonClick = sinon.spy();
        const linkWrapper = shallow(<User {...minProps} select={onButtonClick}/>)
        linkWrapper.find('Link').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });
});
