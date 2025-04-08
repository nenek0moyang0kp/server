// Masonry.js
import { useState, useEffect, useMemo, useRef } from "react";
import { useTransition, a } from "@react-spring/web";

function Masonry({ data, onClick }) {
  const [columns, setColumns] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width >= 1500) setColumns(5);
      else if (width >= 1000) setColumns(4);
      else if (width >= 768) setColumns(3);
      else if (width >= 480) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const ref = useRef();
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) setContainerWidth(ref.current.offsetWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [heights, gridItems] = useMemo(() => {
    const columnWidth = containerWidth / columns;
    let heights = new Array(columns).fill(0);

    const items = data.map((item) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = columnWidth * column;
      const y = (heights[column] += columnWidth) - columnWidth;

      return {
        ...item,
        x,
        y,
        width: columnWidth,
        height: columnWidth,
      };
    });

    return [heights, items];
  }, [columns, data, containerWidth]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    config: { tension: 220, friction: 22 },
    trail: 25,
  });

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: Math.max(...heights) }}
    >
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={style}
          className="absolute will-change-transform cursor-pointer"
          onClick={() => onClick(item)}
        >
          <div className="p-1 w-full h-full">
            <div className="relative w-full h-full overflow-hidden bg-gray-800 aspect-square group">
              <img
                src={item.image}
                alt={`Post ${item.id}`}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white flex items-center space-x-4">
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {item.likes || "0"}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {item.comments || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </a.div>
      ))}
    </div>
  );
}

export default Masonry;
