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
  friendId: string;
}

export const Shape = (props: ShapeProps) => {
  const { socket, friendId } = props;

  const startRealPain = () => {
    if (friendId) {
      const canvasJsonData = canvas.toJSON();
      socket.emit(SocketEvent.draw, { canvasJsonData, to: friendId });
    }
  };

  /**
   * 
   * @param {ShapeTypes} type 
   */
  const handleAddShape = (type: ShapeTypes) => {
    let shapeInstance: any;

    switch (type) {
      case ShapeTypes.Circle:
        shapeInstance = new fabric.Circle({ radius: 25, fill: '#19282C', left: 150, top: 150 });
        break;
      case ShapeTypes.Square:
        shapeInstance = new fabric.Rect({ fill: 'green', width: 50, height: 50, left: 200, top: 200 });
        break;
      default:
        shapeInstance = new fabric.Triangle({
          fill: '#045A68', width: 50, height: 50, left: 240, top: 240
        });
        break;
    }
    canvas.add(shapeInstance);
    startRealPain();
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
      startRealPain();
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



  React.useEffect(() => {
    socket.on(SocketEvent.draw, ({ canvasJsonData }: any) => {
      if (canvasJsonData) {
        canvas.loadFromJSON(canvasJsonData, () => {
          canvas.renderAll();
        });
      }
    });
  }, [socket]);

  React.useEffect(() => {
    canvas = new fabric.Canvas('shape', { width: 1000, height: 700 });
    customDelete();
    canvas.on('object:scaling', () => startRealPain());
    canvas.on('object:rotating', () => startRealPain());
    canvas.on('object:moving', () => startRealPain());
  }, []);

  return <>
    <Grid className='shape-container'>
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

export default Shape;