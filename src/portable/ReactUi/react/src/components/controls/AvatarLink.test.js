import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import AvatarLink from './AvatarLink';

configure({ adapter: new Adapter() })

describe('Control: AvatarLink', () => {
    const minProps = {
        id: "my id",
        name: "my name",
        select: () => {return boolean;},
        target: "/root",
        uri: "images/myImage.png",
    };

    it('renders without exploding', () => {
        expect(
            shallow(
                <AvatarLink {...minProps} />
            ).length
        ).toEqual(1);
    });

    it('sets avatar name', () => {
        const wrapper = shallow(<AvatarLink {...minProps} />)
        expect(
            wrapper.find('Avatar').prop('name')
        ).toEqual('my name')
    });

    it('sets avatar uri', () => {
        const wrapper = shallow(<AvatarLink {...minProps}/>)
        expect(
            wrapper.find('Avatar').prop('src')
        ).toEqual('images/myImage.png')
    });

    it('sets link target', () => {
        const wrapper = shallow(<AvatarLink {...minProps}/>)
        expect(
            wrapper.find('Link').prop('to')
        ).toEqual('/root')
    });

    it('sets link action', () => {
        const onButtonClick = sinon.spy();
        const wrapper = shallow(<AvatarLink {...minProps} select={onButtonClick}/>);
        wrapper.find('Link').simulate('click');
        expect(onButtonClick.calledOnce).toEqual(true);
    });

    it('set size of avatar', () => {
        const wrapper = shallow(<AvatarLink {...minProps} size="48"/>)
        expect(
            wrapper.find('Avatar').prop('size')
        ).toEqual('48')
    });
});
