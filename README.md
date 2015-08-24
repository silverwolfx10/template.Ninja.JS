### $template

Micro template com recursos do puro do javascript a funcao curry e com memoizacao para evitar processamento repitidos

```html
<script type="text/html" id="user_tmplate">
  <% while (users.hasNext()) { %>
    <li>
      <a href="<%= users.next().url %>"><%= users.current().name %></a>
    </li>
  <% } %>
</script>
```

```javascript
Ninja(['$iterator', '$template'], function ($iterator, $template) {

  function $(selector) {
    return document.querySelector(selector);
  }
  
  function render(html) {
    $('body').innerHTML = html;
  }
  
  $template($('#user_tmplate').innerHTML, $iterator([{ url: '#', name: 'cleber.programmer' }]));
  
});
```
