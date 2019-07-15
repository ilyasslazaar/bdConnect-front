import React from "react";
import Dropzone from "react-dropzone";

export const DropZone = ({ onDrop }) => {
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p className="text-center m-0 p-4">
              <i className="simple-icon-plus h2" />
              <span className="d-block">
                Drag 'n' drop some files here, or click to select files
              </span>
            </p>
          </div>
        </section>
      )}
    </Dropzone>
  );
};
