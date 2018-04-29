import React, { Component } from 'react';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';
import {Story} from 'inkjs/dist/ink';
import data from './storyData/FRC Assistant.js.json';
import resources from './storyData/resources.json';

// Yeah, this is kinda hacky, inky exports v18 files but inkjs only deals with v17 files
// The main differences are in whitespace handling which, for html, is irrelevant... so far
data.inkVersion = 17;
    

class App extends Component {
  constructor() {
    super();
    this.story = new Story(data);
    this.state = {messages: []};
  
  }

  componentDidMount(){
    const messages = this.continueStory();
    this.setState({messages})
  }

  extractTag(tag){
    let tagParsed = JSON.parse(tag);
    let data = _.get(resources, tagParsed.resource);
    return {type: 'tag', path: tagParsed.resource ,data}
  }

  continueStory = () => {
    let messages = [];
    let count = 0;
    while(this.story.canContinue) {
      
      this.story.Continue();
      let tags = this.story.currentTags.map(this.extractTag);
      messages = [...messages, ...tags];      
      messages.push({type: 'story', message: this.story.currentText});
      console.log(this.story.currentText, count++);
      
      console.log(tags);
      
      
    }
    let choices = this.story.currentChoices.map((c,i) => { return {type: 'choice', message: c.text, choiceIndex: i }})
    messages = messages.concat(choices);
    return messages;
  }

  chooseOption = (i) => {
    return () => {
      this.story.ChooseChoiceIndex(i);
      this.story.Continue();
      const messages = this.continueStory();
      
      this.setState({messages})
    }
  }

  render() {
    console.log(this.state);
    
    return (
      <div className="App container">
        {this.state.messages.map((m, i) => <Message key={i} message={m}onChoiceClick={this.chooseOption}/>)}
      </div>
    );
  }
}

export default App;

const Message = ({message, index, onChoiceClick}) => {
  switch(message.type) {
    case 'story':
      return <BotResponse message={message} />
    case 'choice':
      return <Choice message={message} onChoose={onChoiceClick} />
    case 'tag':
      return <Tag message={message} />
    default:
      return null;
  }

}

const BotResponse = ({ message }) => {
  return <div className='bot-response'>{message.message}</div>
}

const Choice = ({ message, onChoose }) => {
  return <div className='choice' onClick={onChoose(message.choiceIndex)}>{message.message}</div>
}

const Tag = ({ message }) => {
  if(!message.data){
    return <div className='error'>I'm supposed to know of a resource here at <strong>{message.path}</strong> but it didn't load correctly.</div>
  }
  return (
    <div className='resource'>
      <div className='thumbnail'>
        <a href={message.data.link} target="_blank">
          <img src={message.data.thumbnail} />
        </a>
      </div>
      <div>
        Source: {message.data.source}
      </div>
      
    </div>
  );
}