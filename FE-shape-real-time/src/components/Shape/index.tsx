import * as React from 'react';
import { fabric } from "fabric";
import { Grid } from 'semantic-ui-react';
import LeftMenu from './Menu/LeftMenu';
import { Transform } from 'fabric/fabric-impl';
import { ShapeTypes } from '../../constants/enums';
import { DeleteIcon, SocketEvent } from '../../constants/videoConstants';

let canvas: any;

interface ShapeProps {
  socket: any;
}

export const Shape = (props: ShapeProps) => {
  const drawingId = sessionStorage.getItem('drawingId');
  const { socket } = props;

  const handleAddShape = (type: ShapeTypes) => {
    let shapeInstance: any;

    switch (type) {
      case ShapeTypes.Circle:
        shapeInstance = new fabric.Circle({ radius: 30, fill: 'green', left: 150, top: 150 });
        break;
      case ShapeTypes.Square:
        shapeInstance = new fabric.Rect({ fill: 'green', width: 50, height: 50, left: 200, top: 200 });
        break;
      default:
        shapeInstance = new fabric.Triangle({
          fill: 'green', width: 50, height: 50, left: 240, top: 240
        });
        break;
    }
    canvas.add(shapeInstance);
  };

  const customDelete = () => {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';
    const img = document.createElement('img');
    img.src = DeleteIcon;

    const deleteObject = (eventData: MouseEvent, transform: Transform): boolean => {
      const target = transform.target;
      const canvas = target.canvas;
      canvas?.remove(target);
      canvas?.requestRenderAll();
      return true;
    };

    const renderIcon = (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) => {
      const size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    };

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon
    });
  };

  const startPain = () => {
    if (drawingId) {
      const canvas = document.getElementById('shape') as HTMLCanvasElement;
      const base64ImageData = canvas.toDataURL("image/png");
      socket.emit(SocketEvent.draw, { base64ImageData, to: drawingId });
    }
  };

  React.useEffect(() => {
    socket
      .on(SocketEvent.draw, (data: any) => {
        if (data && !drawingId) {
          const image = new Image();
          const canvas = document.querySelector('#shape') as HTMLCanvasElement;
          const ctx = canvas?.getContext('2d');
          image.onload = function () {
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(image, 0, 0);
            }
          };

          image.src = data.base64ImageData;
        }
      })
      .emit(SocketEvent.init);
  }, [socket]);

  React.useEffect(() => {
    canvas = new fabric.Canvas('shape', { width: 1000, height: 700 });
    customDelete();
    canvas.on('after:render', () => {
      startPain();
    });

  }, []);

  return <>
    <Grid>
      <Grid.Column width={4}>
        <LeftMenu handleAddShape={handleAddShape} />
      </Grid.Column>
      <Grid.Column width={12}>
        <img id='source' style={{ display: 'none' }} />
        <div className='shape-paint' >
          <canvas className='shape' id='shape' ></canvas>
        </div>
      </Grid.Column>
    </Grid>
  </>;
};