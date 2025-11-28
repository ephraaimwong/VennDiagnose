import interact from "interactjs";
import { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
export default function VennDiagram(){
    //#region Component Constants
    //constants for venn diagram scene
    const diagramWidth = 800;
    const diagramHeight = 500;

    const [circle, setCircle] = useState([
        {id: 1, cx: diagramWidth/2, cy: diagramHeight/2, r:50},
        {id: 2, cx: diagramWidth/2+200, cy: diagramHeight/2, r:80},
        {id: 3, cx: diagramWidth/2-200, cy: diagramHeight/2, r:40}
    ]);
    //map circleID -> ref
    const circleRefs = useRef({}); 
    const resizeRefs = useRef({});
    const svgRef = useRef(null);

    // const circleRef = useRef(null);
    // const resizeRef = useRef(null);

    const [selectedIDs, setSelectedIDs] = useState([]); //for group selection

    // const [selected, setSelected] = useState(false);    
    // const [resizeHandle, setResizeHandle] = useState({x:0, y:0});

    const initializedElem = useRef({});
    //#endregion

    useEffect(() => {
        const interactable = [];
        const handleInteractable = [];

        circle.forEach( i => {
            // if(initCircles.current.has(i.id)) return; //check if circle already initialized

            const elem = circleRefs.current[i.id];
            
            if (!elem) return;

            const interactObject = interact(elem).draggable({
                //------drag handler --------
                modifiers: [
                    interact.modifiers.restrict({ restriction: 'parent' })
                ],
                listeners:{
                    move(event){
                        setCircle(prev => prev.map(
                            ii => ii.id === i.id ? {
                                ...ii, //shallow clone
                                cx: ii.cx + event.dx,
                                cy: ii.cy + event.dy
                            } : ii)
                        )
                    }
                }
            }).resizable({
                // ------- resize from border --------
                edges: {
                    left: true,
                    right: true,
                    top: true,
                    bottom: true
                },
                listeners: {
                    move(event) {
                        // const cx = i.cx;
                        // const cy = i.cy;

                        let newRadius = i.r;


                        if (event.edges.left || event.edges.right   ) newRadius = Math.max(Math.abs(parseFloat(event.rect.width)/2), 5);
                        if (event.edges.top || event.edges.bottom   ) newRadius = Math.max(Math.abs(parseFloat(event.rect.height)/2), 5);

                        setCircle(prev => prev.map(
                            ii => ii.id === i.id ? {
                                ...ii,
                                r: newRadius
                            } : ii)
                        );
                    }
                }
            });

            interactable.push(interactObject);

            const hElem = resizeRefs.current[i.id];
            if (!hElem) return;
            const interactObjectHandle = interact(hElem).draggable({
                listeners: {
                    move(event) {
                        const newcx = parseFloat(hElem.getAttribute("cx")) + event.dx;
                        const newcy = parseFloat(hElem.getAttribute("cy")) + event.dy;

                        setCircle(prev => prev.map(ii => {
                            if(ii.id !== i.id) return ii;

                            const newRadius = Math.sqrt((newcx - ii.cx) ** 2 + (newcy - ii.cy) ** 2);
                            return {...ii, r: newRadius};
                        }));
                    }
                }
            });
            // handleInteractable.push(interactObjectHandle);
            // initCircles.current.add(i.id);
            initializedElem.current[i.id] = true;
        });
     
    }, [circle.length]);

    const moveableTargets = selectedIDs.map( (id) => circleRefs.current[id] );


    return(
        <div>
        <svg 
            ref={svgRef}
            width={diagramWidth} 
            height={diagramHeight} 
            className=" border-red-600 border-2"
            onClick={() => setSelectedIDs([])}
        >
            {/* Drop Zone */}
            {circle.map(i => (
                <g 
                key={i.id}
                data-id={i.id}
                >

                    <circle 
                        ref={elem => (circleRefs.current[i.id] = elem)}
                        cx={i.cx} 
                        cy={i.cy} 
                        r={i.r} 
                        fill="red"
                        stroke="green"
                        opacity={0.5}
                        
                        onClick={ event => {
                            event.stopPropagation();
                            setSelectedIDs( (prev) => 
                                prev.includes(i.id) 
                                ? prev.filter( (id) =>id !== i.id) : [...prev, i.id]);
                        }}
                    />
                    {/* {selectedIDs && ( */}
                        <circle
                            ref = {elem => (resizeRefs.current[i.id] = elem)}
                            cx = {i.cx + i.r}
                            cy = {i.cy}
                            r= {5}
                            stroke = "yellow"
                            style={{ cursor: "grab" }}
                        />
                    {/* )} */}
                </g>
            ))}
        </svg>

        {moveableTargets.length > 1 && (
        <Moveable
            target={moveableTargets}
            container={svgRef.current}
            draggable={true}
            resizeable={true}
            throttleDrag={1}
            scalable={true}
            onDrag={(target, beforeDelta) => {
                const id = Number(target.dataset.id);
                setCircle( (prev) => prev.map( (i) => i.id === id ? {...i, cx: i.cx + beforeDelta[0], cy: i.cy + beforeDelta[1]} : i 
                ));
            }}
            

        />)}
    </div>
    );
    
};