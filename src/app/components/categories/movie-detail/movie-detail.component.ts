import { MoviesService } from 'src/app/services/movies.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CATEGORIES } from 'src/app/constants/base.constants';
import { IMovieDetail } from 'src/app/models/movie-detail';
import { API_CONFIG } from 'src/app/constants/api.constant';
import { IMovieCast, IMovieCredits } from 'src/app/models/movie-cast';
import { IMovieVideo } from 'src/app/models/video';
import { IAPIResponse } from 'src/app/models/api.model';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  private routeSub: Subscription;
  movieID: Number;
  menuType: String;
  movieData: IMovieDetail;
  credits: Array<IMovieCast>;
  movieVideos: any;
  appConfig = API_CONFIG;
  constructor(private route: ActivatedRoute, private router: Router, private moviesService: MoviesService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (!this.router.url || !params || !params['id']) {
       return; 
      }
      this.movieID = params['id'];
      this.menuType = this.capitalizeFirstLetter(this.router.url.slice(1));
      if (this.menuType.includes(CATEGORIES.MOVIES)) {
        this.menuType = CATEGORIES.MOVIES;
      } else {
        this.menuType = CATEGORIES.TV_SERIES;
      }
      this.getDetail(this.menuType, this.movieID);
      this.getCredits(this.menuType, this.movieID);
      this.getVideos(this.menuType, this.movieID);
    });

  }
  
  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getDetail(categories: String, id: Number) {
    this.moviesService.getDetail(categories, id).subscribe({
      next: (data: IMovieDetail) => {
        if (!data) {
          return;
        }
        data.backdrop_path = API_CONFIG.ORIGINAL_IMAGE(data.backdrop_path || data.poster_path);
        data.poster_path = API_CONFIG.ORIGINAL_IMAGE(data.poster_path || data.backdrop_path);
        this.movieData = data;
      }
    });
  }

  getCredits(categories: String, id: Number) {
    this.moviesService.getCredit(categories, id).subscribe({
      next: (data: IMovieCredits) => {
        if (!data || !data.cast) {
          return;
        }
        this.credits = data.cast.slice(0, 5);
      }
    })
  }

  getVideos(categories: String, id: Number) {
    this.moviesService.getVideos(id, categories).subscribe({
      next: (data: IAPIResponse) => {
        if (!data) {
          return;
        }
        this.movieVideos = data.results;
        console.log("movieVideos: ", this.movieVideos);
      }
    })
  }

}
