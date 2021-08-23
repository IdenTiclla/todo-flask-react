from flaskr import app, db
from flask import json, jsonify, request, abort
from .models import Todo


@app.get("/todos")
def index():
    todos = [todo.format() for todo in Todo.query.all()]
    return jsonify(todos)

@app.get("/todos/<int:id>")
def get_todo(id):
    todo = Todo.query.get(id)
    if todo:
        return jsonify(todo.format())
    else:
        abort(404)
@app.post("/todos")
def create_todo():
    description = request.json["description"]
    todo = Todo(description=description)
    todo.insert()
    return jsonify({
        "message": "created successfully",
        "success": True,
        "status": 200
    })
    
@app.put("/todos/<int:id>")
def update_todo(id):
    todo = Todo.query.get(id)
    if todo:
        if "description" in request.json:
            todo.description = request.json["description"]

        if "completed" in request.json:
            todo.completed = request.json["completed"]
        
        todo.update()
        return jsonify(todo.format())
    else:
        abort(404)

@app.delete("/todos/<int:id>")
def delete_todo(id):
    todo = Todo.query.get(id)
    if todo:
        todo.delete()
        return jsonify({
            "message": "deleted successfully.",
            "success": True,
            "status": 200
        })
    else:
        abort(404)


@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({
        "success": False,
        "error": 400,
        "message": "bad request"
    }), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found"
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'error': 405,
        'message': 'method not allowed'
    }), 405

@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable"
    }), 422

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({
        "success": False,
        "error": 500,
        "message": "internal server error"
    }), 422