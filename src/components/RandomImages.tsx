import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { fetchRandomImages, Image, deleteImages } from "../features/randomImagesSlice";

const RandomImages: React.FC = () => {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.randomImages.data);
  const [sortOption, setSortOption] = useState<"date" | "title" | "size">("date");
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(fetchRandomImages());
  }, [dispatch]);

  const sortImages = (images: Image[], option: "date" | "title" | "size"): Image[] => {
    switch (option) {
      case "date":
        return [...images].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "title":
        return [...images].sort((a, b) => {
          const firstWordA = a.description?.split(" ")[0] ?? "";
          const firstWordB = b.description?.split(" ")[0] ?? "";
          return firstWordA.localeCompare(firstWordB);
        });
      case "size":
        return [...images].sort((a, b) => b.width * b.height - a.width * a.height);
      default:
        return images;
    }
  };

  const filteredImages = images.filter(image => {
    if (searchTerm === "") {
      return true;
    }
    return (
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.tags && image.tags.some((tag: { title: string }) =>
        tag.title.toLowerCase().includes(searchTerm.toLowerCase())
      )) ||
      image.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  

  const sortedImages = sortImages(filteredImages, sortOption);

  const handleSortOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as "date" | "title" | "size");
  };

  const handleImageSelect = (id: string) => {
    setSelectedImages(prevSelected => ({
      ...prevSelected,
      [id]: !prevSelected[id]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedImages).every(selected => selected);
    const newSelectedImages: Record<string, boolean> = {};
    sortedImages.forEach(image => {
      newSelectedImages[image.id] = !allSelected;
    });
    setSelectedImages(newSelectedImages);
  };

  const handleDeleteSelected = () => {
    const selectedIds: any = Object.keys(selectedImages).filter(id => selectedImages[id]);
    const remainingImages = sortedImages.filter(image => !selectedIds.includes(image.id));
    dispatch(deleteImages(selectedIds));
    setSelectedImages({});
  };

  const selectedCount = Object.values(selectedImages).filter(selected => selected).length;
  const deleteButtonDisabled = selectedCount === 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <label htmlFor="sortOption" className="mr-2">
          Sort by:
        </label>
        <select name="sortOption" id="sortOption" value={sortOption} onChange={handleSortOptionChange}>
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="size">Size</option>
        </select>
      </div>
      <div className="flex mb-4">
        <button className="mr-4" onClick={handleSelectAll}>
          Select All
          </button>
    <button disabled={deleteButtonDisabled} onClick={handleDeleteSelected}>
      Delete Selected ({selectedCount})
    </button>
  </div>
  <div className="mb-4">
    <label htmlFor="search" className="mr-2">
      Search:
    </label>
    <input type="text" id="search" onChange={(e) => setSearchTerm(e.target.value)} />
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {sortedImages.filter((image) => {
  const searchRegex = new RegExp(searchTerm, "i");
  return (
    searchRegex.test(image.description || "") ||
    searchRegex.test(image.alt_description || "") ||
    (image.tags && searchRegex.test(image.tags.map((tag: { title: any; }) => tag.title).join(" "))) ||
    searchRegex.test(image.user.name || "")
  );
})

      .map((image) => (
        <div key={image.id} className="relative">
          <img
            src={image.urls.small}
            alt={image.alt_description || image.description || ""}
            className="rounded-lg object-cover w-full h-full"
          />
          <div
            className={`absolute top-0 left-0 bg-white ${
              selectedImages[image.id] ? "bg-blue-400" : ""
            }`}
          />
          <input
            type="checkbox"
            className="absolute top-2 left-2"
            checked={selectedImages[image.id] || false}
            onChange={() => handleImageSelect(image.id)}
          />
        </div>
      ))}
  </div>
</div>
);
};

export default RandomImages;