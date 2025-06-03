document.addEventListener('DOMContentLoaded', () => {
    const newFolderBtn = document.getElementById('new-folder-btn');
    const uploadBtn = document.querySelectorAll('.btn')[1];
    const downloadBtn = document.querySelectorAll('.btn')[2];
    const fileInput = document.getElementById('file-input');
    const tbody = document.getElementById('file-table-body');
  
    // Create action menu HTML
    const createActionMenu = (fileName) => {
      return `
        <div class="action-menu">
          <button class="menu-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          <div class="menu-content">
            <button class="select-option" data-filename="${fileName}">Select</button>
            <button class="delete-option">Delete</button>
          </div>
        </div>
      `;
    };
  
    // === New Folder ===
    newFolderBtn.addEventListener('click', () => {
      const folderName = prompt('Enter new folder name:');
      if (folderName) {
        const newRow = document.createElement('tr');
        newRow.classList.add('folder');
        const folderPath = '/documents/' + folderName.toLowerCase().replace(/\s+/g, '-');
        newRow.setAttribute('data-path', folderPath);
  
        newRow.innerHTML = `
          <td><i class="fa-solid fa-folder"></i> ${folderName}</td>
          <td>${new Date().toLocaleString()}</td>
          <td>You</td>
          <td>--</td>
          <td>ClientX</td>
          <td></td>
        `;
  
        newRow.addEventListener('click', () => {
          alert('Navigate to folder: ' + folderPath);
        });
  
        tbody.appendChild(newRow);
      }
    });
  
    // === Upload ===
    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });
  
    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      if (!files.length) return;
  
      Array.from(files).forEach(file => {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        const newRow = document.createElement('tr');
  
        newRow.innerHTML = `
          <td><i class="fa-regular fa-file" style="color: #444;"></i> ${file.name}</td>
          <td>${new Date().toLocaleString()}</td>
          <td>You</td>
          <td>${sizeMB}</td>
          <td>ClientX</td>
          <td>${createActionMenu(file.name)}</td>
        `;
  
        tbody.appendChild(newRow);
      });
  
      fileInput.value = '';
    });
  
    // === Download ===
    downloadBtn.addEventListener('click', () => {
      const selected = document.querySelectorAll('.file-check:checked');
      if (selected.length === 0) {
        alert('No file selected for download');
        return;
      }
  
      selected.forEach(input => {
        const fileName = input.getAttribute('data-filename');
        const blob = new Blob([`Sample content for ${fileName}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    });
  
    // === Global click handler for menu buttons ===
    document.body.addEventListener('click', (e) => {
      // Toggle dropdown
      if (e.target.closest('.menu-btn')) {
        document.querySelectorAll('.action-menu').forEach(menu => menu.classList.remove('show'));
        const menu = e.target.closest('.action-menu');
        menu.classList.toggle('show');
      } else {
        // Close all if clicked elsewhere
        document.querySelectorAll('.action-menu').forEach(menu => menu.classList.remove('show'));
      }
  
      // Select option
      if (e.target.classList.contains('select-option')) {
        const row = e.target.closest('tr');
        const fileName = e.target.getAttribute('data-filename');
        if (!row.querySelector('.file-check')) {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.classList.add('file-check');
          checkbox.setAttribute('data-filename', fileName);
          checkbox.checked = true;
          e.target.closest('td').appendChild(checkbox);
        } else {
          row.querySelector('.file-check').checked = true;
        }
      }
  
      // Delete option
      if (e.target.classList.contains('delete-option')) {
        const row = e.target.closest('tr');
        row.remove();
      }
    });
  });
  