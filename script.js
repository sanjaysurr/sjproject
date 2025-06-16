document.addEventListener('DOMContentLoaded', () => {
  const newFolderBtn = document.getElementById('new-folder-btn');
  const uploadBtn = document.querySelectorAll('.btn')[1];
  const downloadBtn = document.querySelectorAll('.btn')[2];
  const fileInput = document.getElementById('file-input');
  const tbody = document.getElementById('file-table-body');
  const breadcrumb = document.querySelector('.breadcrumb');

  // Folder structure and path
  let fileSystem = { "/": {} };
  let currentPath = "/";

  function getCurrentFolder() {
    const parts = currentPath.split("/").filter(Boolean);
    let node = fileSystem["/"];
    for (let part of parts) {
      node = node[part];
    }
    return node;
  }

  function renderFolder() {
    const folder = getCurrentFolder();
    tbody.innerHTML = "";
    breadcrumb.textContent = currentPath;

    // Add back button
    if (currentPath !== "/") {
      const backRow = document.createElement("tr");
      backRow.innerHTML = `
        <td><i class="fa-solid fa-arrow-left"></i> ..</td>
        <td>--</td><td>--</td><td>--</td><td>ClientX</td><td></td>
      `;
      backRow.style.cursor = "pointer";
      backRow.onclick = () => {
        const parts = currentPath.split("/").filter(Boolean);
        parts.pop();
        currentPath = "/" + parts.join("/") + (parts.length ? "/" : "");
        renderFolder();
      };
      tbody.appendChild(backRow);
    }

    for (let name in folder) {
      const item = folder[name];
      const row = document.createElement("tr");

      if (item.type === "folder") {
        row.classList.add("folder");
        row.innerHTML = `
          <td><i class="fa-solid fa-folder"></i> ${name}</td>
          <td>--</td><td>You</td><td>--</td><td>ClientX</td>
          <td>
            <div class="action-menu">
              <button class="menu-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="menu-content">
                <button class="select-option" data-filename="${name}">Select</button>
                <button class="delete-option">Delete</button>
              </div>
            </div>
          </td>
        `;
        row.onclick = (e) => {
          if (!e.target.closest('.action-menu')) {
            currentPath += name + "/";
            renderFolder();
          }
        };
      } else {
        row.innerHTML = `
          <td><i class="fa-regular fa-file"></i> ${name}</td>
          <td>${item.modified}</td><td>You</td><td>${item.size}</td><td>ClientX</td>
          <td>
            <div class="action-menu">
              <button class="menu-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="menu-content">
                <button class="select-option" data-filename="${name}">Select</button>
                <button class="delete-option">Delete</button>
              </div>
            </div>
          </td>
        `;
      }

      tbody.appendChild(row);
    }
  }

  // New Folder
  newFolderBtn.addEventListener("click", () => {
    const folderName = prompt("Enter new folder name:");
    if (!folderName) return;

    const folder = getCurrentFolder();
    if (folder[folderName]) {
      alert("Folder already exists.");
      return;
    }

    folder[folderName] = { type: "folder", children: {} };
    folder[folderName].type = "folder";
    renderFolder();
  });

  // Upload
  uploadBtn.addEventListener("click", () => {
    fileInput.webkitdirectory = true;
    fileInput.multiple = true;
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const folder = getCurrentFolder();
    [...fileInput.files].forEach(file => {
      folder[file.name] = {
        type: "file",
        modified: new Date(file.lastModified).toLocaleString(),
        size: (file.size / 1024).toFixed(1) + " KB"
      };
    });
    renderFolder();
    fileInput.value = "";
  });

  // Action menu
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".menu-btn")) {
      document.querySelectorAll(".action-menu").forEach(m => m.classList.remove("show"));
      const menu = e.target.closest(".action-menu");
      menu.classList.toggle("show");
    } else {
      document.querySelectorAll(".action-menu").forEach(m => m.classList.remove("show"));
    }

    // Delete
    if (e.target.classList.contains("delete-option")) {
      const name = e.target.dataset.filename;
      const folder = getCurrentFolder();
      delete folder[name];
      renderFolder();
    }

    // Select
    if (e.target.classList.contains("select-option")) {
      const row = e.target.closest("tr");
      const fileName = e.target.getAttribute("data-filename");
      if (!row.querySelector(".file-check")) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("file-check");
        checkbox.setAttribute("data-filename", fileName);
        checkbox.checked = true;
        row.querySelector("td").prepend(checkbox);
      } else {
        const checkbox = row.querySelector(".file-check");
        checkbox.checked = !checkbox.checked;
      }
    }
  });

  // Download
  downloadBtn.addEventListener("click", () => {
    const selected = document.querySelectorAll(".file-check:checked");
    if (!selected.length) return alert("No files selected");

    selected.forEach(input => {
      const name = input.getAttribute("data-filename");
      const blob = new Blob([`Sample content of ${name}`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  renderFolder(); // Initial load
});
