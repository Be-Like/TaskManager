import Vue from 'vue';

const Api = require('./api');

document.addEventListener('DOMContentLoaded', () => {
  var app = new Vue({
    el: '#app',
    components: {
      task: {
        props: ['task'],
        template: `
        <div class="ui segment task" v-bind:class="task.completed ? 'done' : 'todo'">
          <div class="ui grid">
            <div class="left floated twelve wide column">
              <div class="ui checkbox">
                <input type="checkbox" name="task" v-on:click="$parent.toggleDone($event, task.id)" :checked="task.completed">
                <label>{{task.id}}: {{task.name}} <span class="description">{{task.description}}</span></label>
              </div>
            </div>
            <div class="right floated three wide column">
              <i class="icon pencil blue" alt="Edit" @click="$parent.editTask($event, task.id)"></i>
              <i class="icon trash red" alt="Delete" @click="$parent.deleteTask($event, task.id)"></i>
            </div>
          </div>
        </div>
        `
      }
    },
    data: {
      tasks: [],
      task: {},
      message: '',
      action: 'create'
    },
    computed: {
      // Note: you cannot use arrow functions when you need access to 'this'
      completedTasks: function() {
        return this.tasks.filter(item => item.completed == true);
      },
      todoTasks: function() {
        return this.tasks.filter(item => item.completed == false);
      },
      nextId: function() {
        return (
          this.tasks.sort(function(a, b) {
            return a.id - b.id;
          })[this.tasks.length - 1].id + 1
        );
      }
    },
    methods: {
      listTasks: function() {
        Api.listTasks().then(function(res) {
          app.tasks = res;
        });
      },
      toggleDone: async function(event, id) {
        event.stopImmediatePropagation();
        let task = this.tasks.find(item => item.id === id);

        if (task) {
          task.completed = !task.completed;
          this.task = task;

          const res = await Api.updateTask(this.task);
          this.listTasks();
          this.clear();

          let status = res.completed ? 'completed' : 'in progress';
          this.message = `Task ${res.id} is ${status}.`;
        }
      },
      deleteTask: async function(event, id) {
        event.stopImmediatePropagation();

        let taskIndex = this.tasks.findIndex(item => item.id == id);

        if (taskIndex > -1) {
          await Api.deleteTask(id);
          this.$delete(this.tasks, taskIndex);
          this.message = `Task ${id} deleted.`;
        }
      },
      editTask: function(event, id) {
        this.action = 'edit';
        let task = this.tasks.find(item => item.id === id);

        if (task) {
          this.task = {
            id: id,
            name: task.name,
            description: task.description,
            completed: task.completed
          };
        }
      },
      updateTask: async function(event, id) {
        event.stopImmediatePropagation();

        const res = await Api.updateTask(this.task);
        this.listTasks();
        this.clear();
        this.message = `Task ${res.id} updated.`;
      },
      clear: function() {
        this.task = {};
        this.action = 'create';
        this.message = '';
      },
      createTask: async function(event) {
        if (!this.task.completed) {
          this.task.completed = false;
        } else {
          this.task.completed = true;
        }

        // Api.createTask(this.task).then(function(res) {
        //   app.listTasks();
        //   app.clear();
        //   app.message = `Task ${res.id} created.`;
        // });

        const res = await Api.createTask(this.task);
        this.listTasks();
        this.clear();
        app.message = `Task ${res.id} created.`;
      }
    },
    beforeMount() {
      this.listTasks();
    }
  });
});
