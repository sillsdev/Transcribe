import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer'
import sinon from 'sinon';
import AvatarLink from '../components/controls/AvatarLink';

configure({ adapter: new Adapter() })

// Snapshot for AvatarLink
describe('>>>Control: Avatarlink --- Snapshot',()=>{
    const minProps = {
        id: "my id",
        name: "my name",
        target: "/root",
        uri: "images/myImage.png",
    };

    it('+++capturing Snapshot of AvatarLink', () => {
        const renderedValue =  renderer.create(<Router><AvatarLink {...minProps}/></Router>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: AvatarLink', () => {
    let wrapper;
    const minProps = {
        id: "my id",
        name: "my name",
        target: "/root",
        uri: "images/myImage.png",
    };

    beforeEach(() => {
        wrapper = shallow(<AvatarLink {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('+++ sets link action', () => {
        const onButtonClick = sinon.spy();
        const linkWrapper = shallow(<AvatarLink {...minProps} select={onButtonClick}/>)
        linkWrapper.find('Link').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });

    it('+++ set size of avatar', () => {
        expect(wrapper.find('Link').get(0).props.children[0].props['size']).toEqual('64')
    });
});
