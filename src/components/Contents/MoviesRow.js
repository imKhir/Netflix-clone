import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { smoothHorizontalScrolling } from '../../utils';
import { useViewport } from '../hooks';
import { setMovieDetail } from '../store/actions';

function MoviesRow(props) {
    const { movies, title, isNetflix, idSessions } = props;
    const sliderRef = useRef();
    const movieRef = useRef();
    const [dragDown, setDragDown] = useState(0);
    const [dragMove, setDragMove] = useState(0);
    const [isDrag, setIsDrag] = useState(false);
    const [windowWidth] = useViewport();

    const dispatch = useDispatch();

    const handleSetMovie = (movie) => {
        dispatch(setMovieDetail(movie));
    };

    const handleScrollRight = () => {
        const maxScrollLeft = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
        console.log(maxScrollLeft);
        if (sliderRef.current.scrollLeft < maxScrollLeft) {
            smoothHorizontalScrolling(
                sliderRef.current,
                250,
                movieRef.current.clientWidth * 2,
                sliderRef.current.scrollLeft,
            );
        }
    };
    const handleScrollLeft = () => {
        if (sliderRef.current.scrollLeft > 0) {
            smoothHorizontalScrolling(
                sliderRef.current,
                250,
                -movieRef.current.clientWidth * 2,
                sliderRef.current.scrollLeft,
            );
        }
    };

    useEffect(() => {
        if (isDrag) {
            if (dragMove < dragDown) handleScrollRight();
            if (dragMove > dragDown) handleScrollLeft();
        }
    }, [dragDown, dragMove, isDrag]);

    const onDragStart = (e) => {
        setIsDrag(true);
        setDragDown(e.screenX);
    };
    const onDragEnd = (e) => {
        setIsDrag(false);
    };
    const onDragEnter = (e) => {
        setDragMove(e.screenX);
    };

    return (
        <MovieRowContainer draggable="false" id={idSessions}>
            <h3 className="heading">{title}</h3>
            <MovieSlider
                ref={sliderRef}
                draggable="true"
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragEnter={onDragEnter}
                style={
                    movies && movies.length > 0
                        ? {
                              gridTemplateColumns: `repeat(${movies.length},
                            ${
                                windowWidth > 1200
                                    ? '360px'
                                    : windowWidth > 992
                                    ? '300px'
                                    : windowWidth > 768
                                    ? '250px'
                                    : '200px'
                            })`,
                          }
                        : {}
                }
            >
                {movies &&
                    movies.length > 0 &&
                    movies.map((movie, index) => {
                        if (movie.poster_path && movie.backdrop_path !== null) {
                            let imageUrl = isNetflix
                                ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                                : `http://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
                            return (
                                <div
                                    key={index}
                                    className="movieItem"
                                    ref={movieRef}
                                    draggable="false"
                                    onClick={() => handleSetMovie(movie)}
                                >
                                    <img src={imageUrl} alt="" draggable="false" />
                                    <div className="movieName">{movie.title && movie.name}</div>
                                </div>
                            );
                        }
                        return null;
                    })}
            </MovieSlider>
            <div className={`btnLeft ${isNetflix && 'isNetflix'}`} onClick={handleScrollLeft}>
                <FiChevronLeft />
            </div>
            <div className={`btnRight ${isNetflix && 'isNetflix'}`} onClick={handleScrollRight}>
                <FiChevronRight />
            </div>
        </MovieRowContainer>
    );
}
export default MoviesRow;

const MovieRowContainer = styled.div`
    background-color: var(--background-color);
    color: var(--white-color);
    padding: 20px 20px 0;
    position: relative;
    width: 100%;
    height: 100%;

    .heading {
        font-size: 1.8rem;
        user-select: none;
    }

    .btnRight {
        right: 30px;
    }

    .btnLeft {
        left: 30px;
    }
    .btnRight,
    .btnLeft {
        position: absolute;
        top: 50%;
        z-index: 20;
        transform-origin: center;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        height: 50px;
        width: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        transform: translateY(-50%);
        &:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        &:hover svg {
            opacity: 1;
            transform: scale(1.2);
        }

        svg {
            opacity: 0.7;
            font-size: 5rem;
            transition: all 0.3 linear;
        }

        &.isNetflix {
            height: 100px;
            width: max-content;
        }
    }
`;

const MovieSlider = styled.div`
    display: grid;
    gap: 6px;
    transition: all 0.3 linear;
    user-select: none;
    overflow: hidden;
    overflow-y: hidden;
    padding-top: 28px;
    padding-bottom: 28px;
    scroll-behavior: smooth;

    &:hover .movieItem {
        opacity: 0.5;
    }

    .movieItem {
        transform: scale(1);
        max-width: 400px;
        max-height: 500px;
        width: 100%;
        height: 100%;
        transition: all 0.3s linear;
        user-select: none;
        overflow: hidden;
        border-radius: 6px;
        transform: center left;
        position: relative;

        &:hover {
            opacity: 1;
            transform: scale(1.1);
            z-index: 10;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .movieName {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 4px;
            text-align: center;
            font-size: 1.4rem;
            background-color: rgba(0, 0, 0, 0.65);
        }
    }
`;
