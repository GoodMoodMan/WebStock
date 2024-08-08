import React, { useEffect } from 'react'
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle, faClock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './App_comp.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function BodyTask(props) {

  const [text, setText] = useState("");
  const [edit_id, setEditId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);



  // this useEffect runs on initial render
  // adds appropriate icon to every task
  useEffect(() => {
    const taskList = [...props.taskList];
    for (const task of taskList) {
      task.icon = icon(task.date);
    }
    props.setTasks(taskList);

  }, [])

  const getMaxID = (taskList) => {
    var id = 0;
    var max_id = 0;
    for (const task of taskList) {
      id = parseInt(task.id.replace(/^\D+/g, ''));
      if (id > max_id) max_id = id;
    }
    return max_id;
  }

  const handleAddTask = () => {
    const newTaskId = "Task " + (getMaxID(props.taskList) + 1);
    const newTaskObj = { id: newTaskId, content: 'New Task', date: new Date(), icon: icon(new Date()) };
    const updatedTasks = [...props.taskList, newTaskObj];
    props.setTasks(updatedTasks);
  };

  const handleDragEnd = (result) => {

    if (!result.destination) return;

    const updatedTasks = [...props.taskList];
    // if dropped on trash can dont return removed task to the task list
    if (result.destination.droppableId === 'trash') {
      updatedTasks.splice(result.source.index, 1);
    }
    else {
      const [removed] = updatedTasks.splice(result.source.index, 1);
      updatedTasks.splice(result.destination.index, 0, removed);
    }

    props.setTasks(updatedTasks);
  };

  const handleSave = () => {
    const update = [...props.taskList];
    var index = update.findIndex(task => task.id === edit_id);
    if (text.trim() !== '') {
      update[index].content = text.slice(0, 1000);
    }
    props.setTasks(update);
    setEditId("");
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      handleSave();
    }
  };

  const handleDeleteAll = () => {
    setShowConfirmation(true);
  };


  const confirmDeleteAll = () => {
    props.setTasks([]);
    setShowConfirmation(false);
  };

  const handleDateChange = (taskID, date) => {
    const update = [...props.taskList];
    var index = update.findIndex(task => task.id === taskID);
    update[index].date = date;
    update[index].icon = icon(date);
    props.setTasks(update);
  }

  const grid = 8;
  const icon = (deadline) => {
    const timeDiff = new Date(deadline) - new Date().getTime();

    const warningThreshold = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    const dangerThreshold = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    // Set the icon based on the time difference
    let icontype = null;
    if (timeDiff <= 0) {
      icontype = <FontAwesomeIcon icon={faExclamationCircle} color="red" />;
    } else if (timeDiff < dangerThreshold) {
      icontype = <FontAwesomeIcon icon={faClock} color="orange" />;
    } else if (timeDiff < warningThreshold) {
      icontype = <FontAwesomeIcon icon={faInfoCircle} color="yellow" />;
    }
    return icontype;
  };
  const getItemStyle = (isDragging, draggableStyle, snapshot, deadline) => {
    const defaultStyle = {
      // some basic styles to make the items look a bit nicer
      userSelect: "none",
      padding: grid * 2,
      margin: `0 0 ${grid}px 0`,

      // change background color if dragging
      background: isDragging ? 'lightgreen' : 'grey',

      // styles we need to apply on draggables
      ...draggableStyle,
    };


    if (isDragging && snapshot.draggingOver === 'trash') {
      return {
        ...defaultStyle,
        opacity: 0,
      };
    }


    return defaultStyle;
  };

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,

  });



  return (
    <div>
      <h1 className="text-center display-1 text-uppercase">

        <span className="login-heading">Task List</span>
      </h1>
      <div className='container d-flex flex-row justify-content-center'>
        <button className="btn btn-primary me-3" onClick={handleAddTask}>
          Add Task
        </button>
        <button className="btn btn-danger ms-3" onClick={handleDeleteAll}>
          Delete All
        </button>
      </div>
      <div className='container d-flex flex-column align-items-center mt-2'>
        <DragDropContext onDragEnd={handleDragEnd} >
          <div className='container-task'>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div className='rounded'
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {props.taskList.map((task, index) => (


                    <Draggable key={task.id} draggableId={task.id} index={index} >
                      {(provided, snapshot) => (
                        <div className='rounded'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                            snapshot,
                            task.date
                          )}
                        >
                          <div className='container d-flex flex-column'>
                            <div className='container d-flex justify-content-center align-items-center'>

                              <div className='d-inline-block me-auto p-2'>
                                <div className='text-block'>
                                  <strong>{task.content}</strong>
                                </div>
                              </div>
                              <div className='container d-flex flex-column'>
                                <p>Finish Date:</p>
                                <DatePicker
                                  selected={new Date(task.date)}
                                  onChange={(date) => handleDateChange(task.id, date)}
                                  className='datepicker'
                                  dateFormat="dd/MM/yyyy"
                                />
                              </div>
                              <div>{task.icon}</div>

                              <button type="button" onClick={() => {
                                if (task.id !== edit_id) {
                                  setText(task.content);
                                  setEditId(task.id);
                                }
                                else {
                                  setEditId(null);
                                }
                              }}

                                className="ms-3 btn btn-primary btn-sm">Edit</button>
                            </div>
                            <div className={`form-container mt-2 ${edit_id === task.id ? 'expanded' : ''}`}>
                              {edit_id === task.id ? (

                                <div className="form-container mt-2 expanded">
                                  <div className="mb-3">
                                    <textarea
                                      className="form-control"
                                      defaultValue={task.content}
                                      onKeyDown={handleKeyDown}
                                      onChange={(e) => setText(e.target.value)}
                                    />
                                  </div>
                                  <button
                                    className="btn btn-primary mt-2"
                                    onClick={handleSave}
                                  >
                                    Save
                                  </button>
                                </div>

                              ) : <></>

                              }
                            </div>
                          </div>
                        </div>
                      )}

                    </Draggable>




                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className='mt-3'>
            <Droppable droppableId='trash' >
              {(provided, snapshot) => (
                <div
                  className={`trash-can`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}

                >
                  <FontAwesomeIcon icon={faTrash} size='5x' className="trash-icon" />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>



        </DragDropContext>
      </div>
      {showConfirmation && (
        <div
        className="modal show"
        tabIndex="-1"
        role="dialog"
        style={{ display: 'block' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center">Confirm Delete All</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowConfirmation(false)}
              />
            </div>
            <div className="modal-body">
            <button className="btn btn-danger" onClick={confirmDeleteAll}>
              Delete All
            </button>
             
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );

}

export default BodyTask;