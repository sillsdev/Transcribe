import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {AvatarEdit} from '../components/AvatarEdit';

configure({ adapter: new Adapter() })

// Snapshot for AvatarEdit
describe('>>>Control: AvatarEdit --- Snapshot',()=>{
    const minProps = {
        avatar: {
            data: "/api/images/smile.svg",
            uri: "/api/images/smile.svg"
        },
        direction: "ltr",
        history: {
            location: {
                pathname: "/main/avatar"
            }
        },
        strings: {
            browse: "Browse",
            newImage: "New Image File",
            zoom: "Scale",
        },
        strings2: {
            discardChanges: "Discard Changes"
        }
    };

    it('+++capturing Snapshot of AvatarEdit', () => {
        const renderedValue =  renderer.create(<Router><AvatarEdit {...minProps} snapShotTest={true}/></Router>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: AvatarEdit', () => {
    let wrapper;
    const minProps = {
        avatar: {
            data: "/api/images/smile.svg",
            uri: "/api/images/smile.svg"
        },
        direction: "ltr",
        history: {
            location: {
                pathname: "/main/avatar"
            }
        },
        strings: {
            browse: "Browse",
            newImage: "New Image File",
            zoom: "Scale",
        },
        strings2: {
            discardChanges: "Discard Changes"
        }
    };

    beforeEach(() => {
        wrapper = shallow(<AvatarEdit {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
