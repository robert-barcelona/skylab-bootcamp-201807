import React, {Component} from 'react'
import EditorPlayer from '../components/EditorPlayer'
import Navbar from '../components/Navbar'


export default class NotebookEditor extends Component {
    
   
    render() {
 
        return (
            <div>
                <Navbar />
                <h1>NOTEBOOK EDITOR</h1>
                
                <EditorPlayer />
                

            </div>
        )
    }
}

