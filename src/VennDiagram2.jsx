//TODO: Figure out layering front, back based on selection
//TODO: Change point membership calculation to dragend

import { useEffect, useRef, useState } from "react";
import { SVG } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import "@svgdotjs/svg.select.js";  
import "@svgdotjs/svg.resize.js";  
import svgDragSelect from "svg-drag-select";

export default function VennDiagram2(){
    const svgRef = useRef(null);
    const circles = useRef({});

    const [selectedIDs, setSelectedIDs] = useState([]);
    
    

    const diagramWidth = 800;
    const diagramHeight = 500;
    const circlesData = [
        { id:1, cx: 200, cy: 250, r: 50, fill: "red" },
        { id:2, cx: 400, cy: 250, r: 60, fill: "green" },
        { id:3, cx: 600, cy: 250, r: 70, fill: "blue" }
    ];

    const triangleData = [
        {id: 100, cx: 200, cy:250, size: 30, fill: "yellow"},
        {id: 101, cx: 230, cy:250, size: 30, fill: "yellow"},
        {id: 103, cx: 450, cy:250, size: 30, fill: "yellow"},
        {id: 104, cx: 550, cy:250, size: 30, fill: "yellow"},
    ];
    

    //helper function to update selectedIDs based on data-selected tag
    function updateSelectedIDs(svg){ 
        const selectedElem = svg.querySelectorAll("[data-selected]");
        const ids = [...selectedElem].map(elem => Number(elem.dataset.id)).filter(Boolean);
        setSelectedIDs(ids);
    }

    function updatePointMembership(point, set){
        const pcx = point.attr("cx");
        const pcy = point.attr("cy");

        const membership = [];
        Object.values(set).forEach(i => {
            const withinX = pcx - i.attr("cx"); //(cx-x)
            const withinY = pcy - i.attr("cy");//(cy-y)
            if( withinX**2 + withinY**2 <= i.attr("r")**2){ //(x-cx)^2 +(y-cy)^2 <=r^2
                membership.push(i.data("id"));
            }
            point.data("sets", membership);
        });
        console.log(point.data("id")+ " : " +membership);
    }

    function getPointsInSet(scene, setID){
        return scene.find("polygon").filter((point) => {
            const sets = point.data("sets") || [];
            return sets.includes(setID);
        }).map(point => point.data("id"));
        
    }

    function customDraggableLogic(scene, element){
        element.draggable();
        //bind listeners to dragstart (svg.draggable.js)
            element.on("dragstart", function () {
                // const selected =scene.find("[data-selected]"); //lassoed via svg-drag-select
                this.data("isLeader", true); //element drag is triggered on
            });

            //compute drag displacement(delta)
            element.on("dragmove", function(event){
                if(!this.data("isLeader")) return; //ignore if not leader
                const { dx, dy } = event.detail; //get delta x, delta y of leader from drag handler
                const selected = scene.find("[data-selected]"); //get all selected
                selected.forEach((elem) => {
                    //update cx, cy for all shapes
                    elem.attr({
                        cx:elem.bbox().cx,
                        cy:elem.bbox().cy
                    });
                    if (elem === this) return; // leader already moving by drag
                    elem.dmove(dx, dy); // Manually move selected by the same delta
                    
                    updatePointMembership(elem, circles.current);
                    
                    
                });
            });

            element.on("dragend", function(){
                this.data("isLeader", null); //removes the isLeader data when drag ends
            })
    }

    useEffect( () => {
        //init svg drawing scene
        const scene = SVG().addTo(svgRef.current).size(diagramWidth, diagramHeight);
        // create groups for layering
        const setLayer = scene.group();
        const pointLayer = scene.group();
        

        triangleData.forEach((t) => {
            const h = t.size * Math.sqrt(3)/2;
            const points = [
                [t.cx, t.cy - h/2],
                [t.cx - t.size/2, t.cy + h/2],
                [t.cx + t.size/2, t.cy + h/2]
            ];
            const triangle = scene.polygon(points.map( p => p.join(',')).join(',')).fill(t.fill).attr({ "data-id": t.id, cx: t.cx, cy:t.cy})
            customDraggableLogic(scene, triangle);
            pointLayer.add(triangle);
            updatePointMembership(triangle, circles.current);
        });

        circlesData.forEach((c) => {
            const circle = scene
            .circle(c.r * 2)
            .attr({ "data-id": c.id, cx: c.cx, cy: c.cy, fill: c.fill, opacity: 0.2 });
        customDraggableLogic(scene, circle);
        circles.current[c.id]=circle;
        setLayer.add(circle);
    });


    const { cancel, dragAreaOverlay } = svgDragSelect({
        svg: scene.node,
        selector: "intersection", //enclosure || intersection

        onSelectionStart({ svg, pointerEvent, cancel }){
            // check if pointer is over any circle
            let el = pointerEvent.target; //DOM element
            while (el && el !== svg) {
                if(el.dataset){ //element selected is a node
                    if(el.dataset.selected !== undefined){ //pointer is over existing selected
                        cancel(); return;
                    } else { //pointer is over non-selected ()
                        //clear existing selected
                        const selectedElem = svg.querySelectorAll("[data-selected]");
                        selectedElem.forEach( (i) => i.removeAttribute("data-selected"));
                        //set new selected
                        el.setAttribute("data-selected", "");
                        updateSelectedIDs(svg);
                        cancel(); return;
                    }
                }
                el = el.parentNode; //set current elem to SVG layer (outermost)
            }
            //drop all currently selected if click on empty space
            const selectedElem = svg.querySelectorAll("[data-selected]");
            selectedElem.forEach( (i) => i.removeAttribute("data-selected"));
            updateSelectedIDs(svg);
            
        },

        onSelectionChange({ svg, selectedElements, previousSelectedElements, newlySelectedElements, newlyDeselectedElements }){
            newlyDeselectedElements.forEach((elem) => {
                elem.removeAttribute("data-selected");
                // if (elem.type === 'circle') elem.back();
            });
            newlySelectedElements.forEach((elem) => elem.setAttribute("data-selected", ""));
            updateSelectedIDs(svg);
        }
        });

        console.log(getPointsInSet(scene, 1));
        console.log(getPointsInSet(scene, 2));
        console.log(getPointsInSet(scene, 3));


        return () => {
            scene.clear();
            scene.remove();
        };
    },[]);

    
    return(
        <div>
            <div ref={svgRef} className=" border-red-600 border-2"></div>
            <p>Selected IDs: {selectedIDs.join(", ")}</p>
        </div>
    );
}