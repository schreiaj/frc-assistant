import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Story} from 'inkjs/dist/ink';
import data from './storyData/FRC Assistant.js.json';

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

  continueStory = () => {
    let messages = [];
    let count = 0;
    while(this.story.canContinue) {
      
      this.story.Continue();
      let tags = this.story.currentTags.map( t => {return {type: 'tag', data: JSON.parse(t)}});
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
      return <div className='bot-response'>{message.message}</div>
    case 'choice':
      return <div className='choice' onClick={onChoiceClick(message.choiceIndex)}>{message.message}</div>
    case 'tag':
      return <div className='resource'><a href={message.data.link} target="_blank"><img src={message.data.thumbnail} /></a></div>
    default:
      return null;
  }

}

