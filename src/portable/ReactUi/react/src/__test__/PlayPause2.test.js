/* jshint esversion: 6 */
import * as React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import * as actions from '../actions/audioActions';
import PlayPause from '../components/controls/PlayPause';

configure({ adapter: new Adapter() })

// Snapshot for PlayPause
describe('>>>Control: PlayPause --- Snapshot',()=>{
    const minProps = {
        direction: 'ltr',
        playing: false,
        playStatus: actions.playStatus,
        selectedUser: 'admin',
        users: [{username:{id:"admin"},hotkey:[{id:"play-pause", text:"Esc"}]}],
    };

    it('+++capturing Snapshot of PlayPause', () => {
        const renderedValue =  renderer.create(<PlayPause {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: PlayPause', () => {
    let wrapper;
    const minProps = {
        direction: 'ltr',
        playing: false,
        playStatus: actions.playStatus,
        selectedUser: 'admin',
        users: [{username:{id:"admin"},hotkey:[{id:"play-pause", text:"Esc"}]}],
    };

    beforeEach(()=>{
        wrapper = shallow(<PlayPause {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
