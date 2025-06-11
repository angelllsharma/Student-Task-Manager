from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class TaskManager:
    def __init__(self):
        self.tasks = []
        self.next_id = 1

    def get_tasks(self):
        return self.tasks

    def add_task(self, content):
        task = {"id": self.next_id, "content": content, "completed": False}
        self.tasks.append(task)
        self.next_id += 1
        return task

    def delete_task(self, task_id):
        self.tasks = [t for t in self.tasks if t["id"] != task_id]
        return {"status": "deleted"}

    def mark_completed(self, task_id):
        for task in self.tasks:
            if task["id"] == task_id:
                task["completed"] = True
        return {"status": "updated"}

task_manager = TaskManager()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(task_manager.get_tasks())

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    content = data.get("content", "")
    if content:
        return jsonify(task_manager.add_task(content)), 201
    return jsonify({"error": "Task content required"}), 400

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    return jsonify(task_manager.delete_task(task_id))

@app.route('/api/tasks/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    return jsonify(task_manager.mark_completed(task_id))

if __name__ == '__main__':
    app.run(debug=True)


