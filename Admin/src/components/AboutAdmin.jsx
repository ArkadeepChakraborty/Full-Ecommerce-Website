import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const AboutAdmin = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState(["", "", "", ""]);
  const [files, setFiles] = useState([null, null, null, null]);
  const [contentId, setContentId] = useState(null);

  // Fetch existing content
  const fetchContent = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/aboutAdmin/get");
      if (data.success) {
        const fetched = data.data;
        setTitle(fetched.title || "");
        setContent(fetched.content || "");
        setImages([
          fetched.image1 || "",
          fetched.image2 || "",
          fetched.image3 || "",
          fetched.image4 || ""
        ]);
        setContentId(fetched._id);
      }
    } catch (error) {
      console.error("Error fetching about content:", error);
    }
  };

  useEffect(() => {
    fetchContent();
    toast("Welcome to edit content page!");
  }, []);

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);

    const newImages = [...images];
    newImages[index] = URL.createObjectURL(file);
    setImages(newImages);
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      files.forEach((file, index) => {
        if (file) {
          formData.append(`image${index + 1}`, file);
        }
      });


      let response;
      if (contentId) {
        response = await axios.put(
          `http://localhost:8000/api/v1/aboutAdmin/update/${contentId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(
          "http://localhost:8000/api/v1/aboutAdmin/save",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response.data.success) {
        toast.success(response.data.message);
        fetchContent();
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("An error occurred while saving");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex w-full flex-col">
        <div className="bg-white rounded-md p-6 border border-gray-200 overflow-y-scroll h-[88vh] shadow-sm">

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Edit About Page</h2>

          {/* Info Banner */}
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 shadow">
            <p>You can edit the title, content, and images displayed on the About page.</p>
          </div>

          {/* Title */}
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-blue-500"
          />

          {/* Content */}
          <label className="block font-semibold mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-3 border rounded-lg mb-6 shadow-sm focus:ring-2 focus:ring-blue-500"
          ></textarea>

          {/* Images */}
          <h3 className="text-xl font-semibold mb-3">Images</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg p-4 border flex flex-col items-center"
              >
                <p className="font-medium mb-2">Image {index + 1}</p>

                {images[index] ? (
                  <img
                    src={images[index]}
                    alt={`Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg mb-3 border"
                  />
                ) : (
                <div className="w-full h-40 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-400 mb-3">
                  No Image
                </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  className="w-full bg-gray-50 p-2 rounded border"
                />
              </div>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={saveChanges}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow mt-8 text-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default AboutAdmin;