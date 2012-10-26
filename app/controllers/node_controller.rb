class NodeController < ApplicationController
  def show
    @project = Project.find(params[:id])
    @users = User.all()
    @project_ideas = Idea.where("project_id = ?", params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @project_ideas }
    end
  end
  
  def index
    @project = Project.find(params[:id])
    @project_ideas = Idea.where("project_id = ?", params[:id])
    @users = User.all()
    respond_to do |format|
      format.html # index.html.erb
      format.xml  #{ render :xml => @users }
      #format.json  { render :file => "index.json.erb", :content_type => 'application/json' }
      format.json #{render :json => @project_ideas}
    end
  end
  
  def test
    @project = Project.find(params[:id])
    @project_ideas = Idea.where("project_id = ?", params[:id])
    @users = User.all()

    @project_ideas.each do |p_idea|
      if p_idea.ancestor == nil
        @n_id = p_idea.id
        @idea = p_idea
      end
    end
    respond_to do |format|
      format.html # index.html.erb
      format.xml  #{ render :xml => @users }
      #format.json  { render :file => "index.json.erb", :content_type => 'application/json' }
      format.json #{render :json => @project_ideas}
    end
  end
  
  def as_json(options={})
    super(:only => [:id, :title])
  end
end
