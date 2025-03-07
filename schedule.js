const scheduleUpload = document.getElementById("scheduleUpload");
const schedulePreview = document.getElementById("schedulePreview");
const previewImg = document.getElementById("previewImg");

// Load image from Local Storage if available
window.addEventListener("load", () => {
    const storedImage = localStorage.getItem("scheduleImage");
    if (storedImage) {
        previewImg.src = storedImage;
        schedulePreview.style.display = "block";
    }
});

// Save and preview uploaded image
scheduleUpload.addEventListener("change", function () {
    const file = scheduleUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            previewImg.src = imageData;
            schedulePreview.style.display = "block";
            localStorage.setItem("scheduleImage", imageData);  // Save image to Local Storage
        };
        reader.readAsDataURL(file);
    } else {
        schedulePreview.style.display = "none";
        previewImg.src = "";
        localStorage.removeItem("scheduleImage");  // Remove image if none is selected
    }
});

